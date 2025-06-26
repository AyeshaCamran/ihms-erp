from sqlalchemy.orm import Session
from . import issue_models, issue_schemas

def create_issue(db: Session, data: issue_schemas.IssueCreate):
    db_issue = issue_models.Issue(**data.dict())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def get_all_issues(db: Session):
    return db.query(issue_models.Issue).all()

def get_issue_by_id(db: Session, issue_id: int):
    return db.query(issue_models.Issue).filter(issue_models.Issue.id == issue_id).first()
