import dataclasses
from typing import List, Optional
from enum import Enum, auto
from pydantic.dataclasses import dataclass
from pydantic import Field, BaseModel
import json


@dataclass
class RequestMixin:
    @classmethod
    def from_request(cls, request):
        values = request.get("input")
        return cls(**values)

    def to_json(self):
        return json.dumps(asdict(self))


@dataclass
class BookDataOutput(RequestMixin):
    title: str
    language: str
    pages: int
    classification: str
    year: int
    isbn: str


@dataclass
class Mutation(RequestMixin):
    getBookData: Optional[BookDataOutput]


class variables(BaseModel):
    role: str = Field(..., alias="x-hasura-role")


@dataclass
class input:
    isbn: str


@dataclass
class action:
    name: str


class getBookDataArgs(BaseModel):
    session_variables: variables
    input: input
    action: action
