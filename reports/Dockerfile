FROM python:3.12-slim

WORKDIR /app

COPY reports/requirements.txt /app/reports/requirements.txt
RUN pip install --no-cache-dir -r /app/reports/requirements.txt

COPY reports /app/reports

EXPOSE 8501

CMD ["streamlit", "run", "/app/reports/streamlit_app.py", "--server.address=0.0.0.0", "--server.port=8501"]
