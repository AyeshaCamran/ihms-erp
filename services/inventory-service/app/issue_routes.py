from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import issue_crud, issue_schemas, database

router = APIRouter()

# DB dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/issues", response_model=issue_schemas.IssueOut)
def create_issue(data: issue_schemas.IssueCreate, db: Session = Depends(get_db)):
    return issue_crud.create_issue(db, data)

@router.get("/issues", response_model=list[issue_schemas.IssueOut])
def get_all_issues(db: Session = Depends(get_db)):
    return issue_crud.get_all_issues(db)

@router.get("/issues/{issue_id}", response_model=issue_schemas.IssueOut)
def get_issue_by_id(issue_id: int, db: Session = Depends(get_db)):
    issue = issue_crud.get_issue_by_id(db, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue
