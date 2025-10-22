import kagglehub

# Download latest version
path = kagglehub.dataset_download("convolutionalnn/kanye-west-lyrics-dataset")

print("Path to dataset files:", path)