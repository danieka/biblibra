FROM python:3.7

RUN pip install pipenv
EXPOSE 80
WORKDIR app
COPY . .
RUN pipenv install --system --deploy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]