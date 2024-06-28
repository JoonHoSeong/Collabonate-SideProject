from django.db import models

# # Create your models here.

from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class AdminUsers(models.Model):
    __tablename__ = 'admin'

    pk = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, nullable=False, unique=True, autoincrement=True)
    admin_name = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'manager', 'member'), default='manager')
    is_activate = Column(Boolean, default=True)
    is_superadmin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())
    last_login = Column(DateTime, nullable=True)

    # def __repr__(self):
        # return f"Admin(id={self.id}, name='{self.admin_name}', email='{self.email}')"