from fastapi import FastAPI, UploadFile, File ,Response,Request
from typing import List
from fastapi.responses import JSONResponse ,StreamingResponse ,FileResponse
import base64
import os
import json
import aiofiles
import subprocess
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with the origin of your frontend app
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
script_dir = os.path.dirname(os.path.abspath(__file__))

def execute_terminal_command(command):
    # Execute the command
    result = subprocess.run(command, shell=True, text=True, capture_output=True)
    # Print the output of the command
    return result.stdout

def pull_kaggle_dataset(dataset_id):
    command = fr'kaggle datasets metadata -p {script_dir}\dataset {dataset_id}'
    return execute_terminal_command(command)


def update_kaggle_dataset():
    command = fr'kaggle datasets version -p {script_dir}\dataset -m "Updated dataset using kaggle API 2024" -r tar'
    return execute_terminal_command(command)

def status_kaggle_dataset(dataset_id):
    command = fr'kaggle datasets status {dataset_id}'
    return execute_terminal_command(command)

def pull_kaggle_notebook(notebook_id):
    command = fr'kaggle kernels pull {notebook_id} -p {script_dir}\notebook -m'
    return execute_terminal_command(command)


def push_kaggle_notebook():
    command = fr'kaggle kernels push -p {script_dir}\notebook'
    return execute_terminal_command(command)


def get_notebook_status(notebook_id):
    command = fr'kaggle kernels status {notebook_id}'
    status_output = execute_terminal_command(command)
    return status_output


def get_notebook_output(notebook_id):
    command = fr'kaggle kernels output {notebook_id} -p {script_dir}\output'
    return execute_terminal_command(command)

def remove_all_contents(directory):
    # Get list of all files and directories in the directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            # If it's a file, remove it
            os.remove(filepath)
        elif os.path.isdir(filepath):
            # If it's a directory, remove its contents recursively
            remove_all_contents(filepath)
            # Remove the directory itself
            os.rmdir(filepath)
VIDEO_FILE_PATH = os.path.join(script_dir, "second_half.mp4")
@app.get("/video")
async def stream_video(request: Request):

    range_header = request.headers.get("Range")

    if not range_header or not range_header.startswith("bytes="):
        raise HTTPException(status_code=416, detail="Range header is required")

    range_value = range_header.replace("bytes=", "")
    start_range, end_range = range_value.split("-")

    try:
        start_range = int(start_range)
        end_range = int(end_range) if end_range else None
    except ValueError:
        raise HTTPException(status_code=416, detail="Invalid range values")

    video_size = os.path.getsize(VIDEO_FILE_PATH)

    if end_range is None:
        end_range = video_size - 1

    start_range = min(max(start_range, 0), video_size - 1)
    end_range = min(end_range, video_size - 1)

    content_length = end_range - start_range + 1

    headers = {
        "Content-Range": f"bytes {start_range}-{end_range}/{video_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
        "Content-Type": "video/mp4",
    }

    async def iter_file():
        try:
            with open(VIDEO_FILE_PATH, "rb") as video_file:
                video_file.seek(start_range)
                remaining = content_length
                while remaining > 0:
                    chunk_size = min(1024 * 8, remaining)
                    data = video_file.read(chunk_size)
                    if not data:
                        break
                    remaining -= len(data)
                    yield data
        except Exception as e:
            logger.error(f"Error streaming video: {e}")
            raise e

    return StreamingResponse(iter_file(), headers=headers, status_code=206)
output_path = os.path.join(script_dir, "output")
@app.post("/uploadVideo")
async def upload_video(video: UploadFile):
    try:
        dataset_path = os.path.join(script_dir, "dataset")
        notebook_path = os.path.join(script_dir, "notebook")
        output_path = os.path.join(script_dir, "output")
        #notebook_id = ""
        os.mkdir(dataset_path)
        os.mkdir(notebook_path)
        os.mkdir(output_path)
        file_path = os.path.join(dataset_path, "video.mp4")
        video_data=await video.read()
        async with aiofiles.open(file_path, "wb") as f:
            await  f.write(video_data)

        # pull_kaggle_dataset("")
        # res=update_kaggle_dataset()

        pull_kaggle_notebook(notebook_id)
        meta = os.path.join(notebook_path, "kernel-metadata.json")
        metaFile=open(meta, "r")
        metaData=json.loads(metaFile.read())
        if not  metaData['enable_gpu']:
            metaData['enable_gpu']  = True
        if not  metaData["enable_internet"]:
            metaData['enable_internet']  = True
        with open(meta, "w") as meta_file:
            json.dump(metaData, meta_file, indent=4)
        push_kaggle_notebook()
        status = get_notebook_status(notebook_id)
        status = "complete"
        print(status)
        get_notebook_output(notebook_id)
        outputFile_path = os.path.join(script_dir,"unversity_stats.json")
        outputFile=open(outputFile_path, "r")
        json_content=json.loads(outputFile.read())
        clips = os.path.join(script_dir,"timestamps_of_univerist_match.txt")
        clips_c= open(clips, "r")
        json_clips_content = json.loads(clips_c.read())
        return {"message": "Success","output":json_content,"events" : json_clips_content}
        remove_all_contents(dataset_path)
        remove_all_contents(notebook_path)
        os.rmdir(dataset_path)
        os.rmdir(notebook_path)
    except Exception as e:
        print(e)
        return {"message": e}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=3013)

