"""Bot Framework configuration, read from environment variables."""
import os


class Config:
    PORT = int(os.environ.get("PORT", 3978))
    APP_ID = os.environ.get("MicrosoftAppId", "")
    APP_PASSWORD = os.environ.get("MicrosoftAppPassword", "")
    APP_TYPE = os.environ.get("MicrosoftAppType", "MultiTenant")
    APP_TENANTID = os.environ.get("MicrosoftAppTenantId", "")

    # Folder of files the bot always has access to, in addition to anything
    # the user attaches in the conversation.
    KNOWLEDGE_FOLDER = os.environ.get("KNOWLEDGE_FOLDER", "sample_files")

    # Where per-conversation attachments and generated reports are staged.
    WORK_DIR = os.environ.get("WORK_DIR", "output/_work")
