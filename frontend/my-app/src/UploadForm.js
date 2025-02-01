import React, { useState } from "react";
import axios from "axios";

function UploadForm({ onUploadSuccess }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("http://localhost:3001/import-excel", formData);
            onUploadSuccess();
        } catch (error) {
            console.error("Fehler beim Hochladen der Datei:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Hochladen</button>
        </div>
    );
}

export default UploadForm;
