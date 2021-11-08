import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { key, host } from "../../../Static";
import { toast } from "react-toastify";
import { useState } from "react";
import Load from "./../../../Error/Load";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "./../../QuillCustoms.css";

export default function LessonDetail({ id, admin }) {
  const [load, setLoad] = useState(true);
  const [lesson, setLesson] = useState({});
  const [editText, setEditText] =
    useState(`CKEditor 5 provides every type of WYSIWYG editing solution imaginable. From editors similar to Google Docs and Medium, to Slack or Twitter like applications, all is possible within a single editing framework.
Builds are ready-to-use solutions to common editing needs. Every build can be customized to include a completely custom set of features. Features are flexible. You can write a custom feature once, and reuse it everywhere!`);
  useEffect(() => {
    if (id !== -1)
      axios
        .get(host + `lessons/${id}?key=` + key())
        .then((result) => {
          setLesson(result.data);
          setLoad(false);
        })
        .catch((err) => {
          toast.error("" + err);
          setLoad(false);
        });
  }, [id]);
  return load ? (
    <Load />
  ) : (
    <>
      <div className="row">
        <h2 className="text-uppercase text-center col">{lesson.name}</h2>
      </div>
      <div className="row">
        <div className="col">
          <ReactQuill
            onChange={(e) => {
              setEditText(e);
            }}
            readOnly={!admin}
            value={editText}
            theme="bubble"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }],
                [{ size: [] }],
                [
                  {
                    color: [
                      "#6610f2",
                      "#6f42c1",
                      "#e83e8c",
                      "#fd7e14",
                      "#ffc107",
                      "#20c997",
                      "#17a2b8",
                      "#fff",
                      "#6c757d",
                      "#343a40",
                      "#007bff",
                      "#6c757d",
                      "#28a745",
                      "#17a2b8",
                      "#ffc107",
                      "#dc3545",
                      "#f8f9fa",
                      "#343a40",
                    ],
                  },
                  {
                    background: [
                      "#6610f2",
                      "#6f42c1",
                      "#e83e8c",
                      "#fd7e14",
                      "#ffc107",
                      "#20c997",
                      "#17a2b8",
                      "#fff",
                      "#6c757d",
                      "#343a40",
                      "#007bff",
                      "#6c757d",
                      "#28a745",
                      "#17a2b8",
                      "#ffc107",
                      "#dc3545",
                      "#f8f9fa",
                      "#343a40",
                      "#0",
                    ],
                  },
                ],
                ["bold", "italic", "underline", "strike"],
                ["blockquote"],
                ["link"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
              ],
              clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
