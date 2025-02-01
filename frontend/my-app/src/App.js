import React, { useState } from "react";
import UploadForm from "./UploadForm";
import CustomerList from "./CustomerList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => {
    setRefresh(!refresh);
  };

  return (
      <div>
        <h1>Rechnungs-App</h1>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        <CustomerList key={refresh} />
      </div>
  );
}

export default App;
