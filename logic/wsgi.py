import sys
import os

# Tambahkan path logic ke PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Sekarang aman untuk import
from app import app

# Untuk Vercel (eksport wsgi callable)
application = app
