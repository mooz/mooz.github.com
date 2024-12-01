#!/usr/bin/env python3
import requests
import re
import toml
from typing import List, Dict, Any
import time
from bs4 import BeautifulSoup

def parse_publication_entry(entry_html: BeautifulSoup) -> Dict[str, Any]:
    """Parse a publication entry from HTML into a dictionary."""
    # Extract title from span with class="title"
    title_span = entry_html.find('span', class_='title')
    if not title_span:
        return None
    title = title_span.get_text().strip()
    
    # Extract authors from spans with itemprop="name" that are direct children of author spans
    authors = []
    cite = entry_html.find('cite', class_='data')
    if cite:
        author_spans = cite.find_all('span', itemprop='author', recursive=False)
        for author_span in author_spans:
            name_span = author_span.find('span', itemprop='name')
            if name_span:
                authors.append(name_span.get_text().strip())
    
    # Extract year from span with itemprop="datePublished"
    year_span = entry_html.find('span', itemprop='datePublished')
    year = int(year_span.get_text()) if year_span else None
    
    # Extract venue from span with itemprop="isPartOf"
    venue_span = entry_html.find('span', itemprop='isPartOf')
    if venue_span:
        name_span = venue_span.find('span', itemprop='name')
        venue = name_span.get_text().strip() if name_span else None
    else:
        venue = None
    
    # Extract DOI or URL from links
    doi = None
    url = None
    nav = entry_html.find('nav', class_='publ')
    if nav:
        # Try to find DOI link
        doi_link = nav.find('a', href=re.compile(r'doi.org'))
        if doi_link:
            doi = doi_link['href'].split('doi.org/')[-1]
        else:
            # If no DOI, get the first PDF or paper link
            pdf_link = nav.find('a', href=re.compile(r'\.(pdf|html)$'))
            if pdf_link:
                url = pdf_link['href']
    
    # Determine type based on the entry class
    pub_type = "conference"  # default
    entry_classes = entry_html.get('class', [])
    if 'article' in entry_classes:
        pub_type = "journal"
    elif 'inproceedings' in entry_classes:
        pub_type = "conference"
        if venue and 'workshop' in venue.lower():
            pub_type = "workshop"
    
    # Get pages if available
    pages_span = entry_html.find('span', itemprop='pagination')
    pages = pages_span.get_text() if pages_span else None
    
    return {
        'title': title,
        'authors': authors,
        'year': year,
        'venue': venue,
        'type': pub_type,
        **(({'pages': pages} if pages else {})),
        **(({'doi': doi} if doi else {'url': url}) if (doi or url) else {})
    }

def fetch_publications(pid: str = "28/11004") -> List[Dict[str, Any]]:
    """Fetch publications from DBLP and parse them."""
    publications = []
    
    # Get the HTML page
    url = f"https://dblp.org/pid/{pid}.html"
    resp = requests.get(url)
    resp.raise_for_status()
    
    # Parse HTML
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    # Find all publication entries
    entries = soup.find_all('li', class_='entry')
    
    # Parse each entry
    for entry in entries:
        try:
            pub_data = parse_publication_entry(entry)
            if pub_data and all(k in pub_data for k in ['title', 'authors', 'year', 'venue', 'type']):
                # Additional validation
                if pub_data['authors'] and len(pub_data['authors']) > 0:
                    publications.append(pub_data)
        except Exception as e:
            print(f"Error parsing entry: {e}")
            continue
    
    # Sort by year (descending)
    publications.sort(key=lambda x: x['year'], reverse=True)
    
    return publications

def main():
    try:
        # Fetch and parse publications
        publications = fetch_publications()
        
        # Format as TOML structure
        toml_data = {'publications': publications}
        
        # Write to file
        with open('data/publications.toml', 'w', encoding='utf-8') as f:
            toml.dump(toml_data, f)
        
        print(f"Successfully updated publications.toml with {len(publications)} entries")
    
    except Exception as e:
        print(f"Error updating publications: {e}")
        raise

if __name__ == "__main__":
    main()
