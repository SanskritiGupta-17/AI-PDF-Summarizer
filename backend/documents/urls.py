from django.urls import path
from .views import (
    upload_research_paper,
    read_pdf_metadata,
    combine_pdfs,
    break_pdf,
    basic_extractive_summary,
    advanced_extractive_summary,
)

urlpatterns = [
    path("upload/", upload_research_paper),
    path("metadata/", read_pdf_metadata),

    # PDF utilities
    path("merge/", combine_pdfs),
    path("split/", break_pdf),

    # Summaries
    path("summary/basic/", basic_extractive_summary),
    path("summary/advanced/", advanced_extractive_summary),
]