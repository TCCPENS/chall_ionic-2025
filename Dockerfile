# Use an official lightweight Python base image
FROM python:3.11-slim

# Install socat using the package manager
# We also clean up the apt cache to keep the image small
RUN apt-get update && apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

# 2. Install Python packages using pip
# Using --no-cache-dir keeps the image size smaller.
RUN pip install --no-cache-dir pycryptodome

# Set the working directory
WORKDIR /app

# Copy ONLY the handler script
COPY public/chall.py .
COPY public/flag.txt .

# Expose the port
EXPOSE 9999

# The command to run when the container starts
# This tells socat to listen on port 9999 and execute our script for each connection
CMD ["socat", "TCP4-LISTEN:9999,fork,reuseaddr", "EXEC:python -u chall.py"]