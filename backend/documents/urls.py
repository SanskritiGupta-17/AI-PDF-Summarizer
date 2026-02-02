from django.urls import path
from .views import (
    pdf_length,
    metadata,
    readdata,
    build_faiss_index,
    semantic_search,
    method1,
    pdf_summary
)
urlpatterns = [
    path('pdf-length/', pdf_length),
    path('metadata/', metadata),
    path('read-data/', readdata),
    path('method1/', method1),
    path('pdf_summary/', pdf_summary),
    path('faiss/build/', build_faiss_index),
    path('faiss/search/', semantic_search),
]