import schedule
import time
from datetime import datetime
from app.services.deletion_service import DeletionService
from app import create_app, db

def daily_cleanup_job():
    """Run daily cleanup tasks"""
    app = create_app()
    
    with app.app_context():
        try:
            print(f"[{datetime.now()}] Starting daily cleanup job...")
            
            # 1. Auto-delete old unmatched items (90+ days)
            old_items_count = DeletionService.auto_cleanup_old_items()
            print(f"Soft-deleted {old_items_count} old unmatched items")
            
            # 2. Hard delete items that were soft-deleted 90+ days ago
            hard_deleted_count = DeletionService.hard_delete_old_items()
            print(f"Hard-deleted {hard_deleted_count} items")
            
            print(f"[{datetime.now()}] Daily cleanup completed successfully")
            
        except Exception as e:
            print(f"[{datetime.now()}] Cleanup job failed: {str(e)}")

def start_scheduler():
    """Start the cleanup scheduler"""
    # Schedule daily cleanup at 2 AM
    schedule.every().day.at("02:00").do(daily_cleanup_job)
    
    print("Cleanup scheduler started. Running daily at 2:00 AM")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    start_scheduler()