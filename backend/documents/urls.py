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
    path('api/pdf-length/', pdf_length),
    path('api/metadata/', metadata),
    path('api/read-data/', readdata),
    path('api/method1/', method1),
    path('api/pdf_summary/', pdf_summary),
    path('api/faiss/build/', build_faiss_index),
    path('api/faiss/search/', semantic_search),
]