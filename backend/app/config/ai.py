from typing import Annotated

from fastapi import Depends
from openai import OpenAI

from app.config.settings import SettingsDep


def get_openai_client(settings: SettingsDep):
    return OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.OPENAI_BASE_URL,
    )


OpenAIClientDep = Annotated[OpenAI, Depends(get_openai_client)]

# Tool examples: https://github.com/vercel-labs/ai-sdk-preview-python-streaming/blob/main/api/utils/tools.py
TOOL_DEFINITIONS = []  # type: ignore

AVAILABLE_TOOLS = {}  # type: ignore
