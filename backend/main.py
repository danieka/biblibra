from fastapi import Body, FastAPI
from getBookDataTypes import getBookDataArgs, BookDataOutput
import requests
from bs4 import BeautifulSoup
from risParser import RIS
import re


app = FastAPI()

number = re.compile(r"(\d+)")


@app.post("/getBookData", response_model=BookDataOutput)
async def getBookDataHandler(input: getBookDataArgs) -> BookDataOutput:
    URL = "http://libris.kb.se/hitlist?p=1&q=isbn%3a{}&t=v&d=libris&s=r&t=v&m=10&f=simp&spell=true".format(
        input.input.isbn
    )

    r = requests.get(URL)
    # If this line causes an error, run 'pip install html5lib' or install html5lib
    soup = BeautifulSoup(r.content, 'html5lib')
    libris_id = soup.find('abbr', attrs={'class': 'unapi-id'})['title']
    ris = requests.get(
        "http://libris.kb.se/unapi?id={}&format=ris".format(libris_id))

    ris_data = RIS(ris.text)

    marc_response = requests.get(
        "http://libris.kb.se/bib/{}?vw=full&tab3=marc".format(libris_id)
    )
    marc = BeautifulSoup(marc_response.content, 'html5lib')

    language = marc.find("th", string="041").parent.findAll(
        "td", recursive=False)[-1].contents[1].strip()

    classification = marc.find("th", string="082").parent.findAll(
        "td", recursive=False)[-1].contents[1].strip()

    pages = marc.find("th", string="300").parent.findAll(
        "td", recursive=False)[-1].contents[1].strip()

    pages = number.search(pages).group()

    return {
        "title": ris_data.records[0]['T1'],
        "language": language,
        "pages": int(pages),
        "classification": classification,
        "year": ris_data.records[0]['Y1'],
        "isbn": input.input.isbn
    }
