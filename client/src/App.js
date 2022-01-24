import React, { useState } from "react";
import "./App.css";

function App() {
	const [file, setFile] = useState("");

	const uploadFile = ({ target }) => {
		const file = target.files[0];
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = (event) => {
			console.log(event.target.result);
		};
	};

	return (
		<div className="App">
			<h1>Hello World</h1>
			<input name="file" type="file" onChange={uploadFile} />
		</div>
	);
}

export default App;
