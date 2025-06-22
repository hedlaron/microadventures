from pydantic import BaseModel, field_validator
from enum import Enum
from datetime import date
from sqlmodel import SQLModel, Field, Relationship

class GenreURLChoices(Enum):
    ROCK = 'rock'
    ELECTRONIC = 'electronic'
    SHOEGAZE = 'shoegaze'
    HIP_HOP = 'hip-hop'
    METAL = 'metal'

class GenreChoices(Enum):
    ROCK = 'Rock'
    ELECTRONIC = 'Electronic'
    SHOEGAZE = 'Shoegaze'
    HIP_HOP = 'Hip-Hop'
    METAL = 'Metal'

class AlbumBase(SQLModel):
    title: str
    release_date: date
    band_id: int | None = Field(default=None, foreign_key="band.id")

class Album(AlbumBase, table=True):
    id: int = Field(default=None, primary_key=True)
    band: "Band" = Relationship(back_populates="albums")

class BandBase(SQLModel):
    name: str
    genre: GenreChoices

class BandCreate(BandBase):
    albums: list[AlbumBase] | None = None #default empty

    @field_validator('genre', mode='before')
    def title_case_genre(cls, value) -> str:
        return value.title() # rock -> Rock 

class Band(BandBase, table=True):
    id: int = Field(default=None, primary_key=True)
    albums: list[Album] = Relationship(back_populates="band")
    date_formed: date | None
