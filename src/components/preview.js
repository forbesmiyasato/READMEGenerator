import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

//Renders the preview of the markdown code (Sample of how it'll look in Github)
const Preview = ({ markdown }) => {
    return (
        <>
            <div className="border rounded p-2 f-1">
                <div className="box-header d-flex align-content-center flex-justify-between bg-white p-2">
                    <h2 className="box-title">README.md</h2>
                </div>
                <div className="box-body p-3 px-4">
                    <MarkdownPreview source={markdown} />
                </div>
            </div>
        </>
    );
};

export default Preview;
