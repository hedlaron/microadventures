import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

engine = _sql.create_engine(settings.database_url)

SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()


# Register Tortoise ORM
register_tortoise(
    app,
    db_url=settings.database_url,
    modules={"models": ["app.db.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
) 