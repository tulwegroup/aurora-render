# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (needed for some numpy/scipy operations)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create directory for persistent storage (matching render.yaml)
RUN mkdir -p /app/jobs

# Expose the port the app runs on
EXPOSE 8000

# Define environment variable for unbuffered logging
ENV PYTHONUNBUFFERED=1

# Default command to run the API (can be overridden by docker-compose or Render)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
