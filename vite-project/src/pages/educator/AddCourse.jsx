import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill/dist/quill.js";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets";
import uniqid from 'uniqid';
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {

  const {backendUrl,getToken}=useContext(AppContext)
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture=(action,chapterId,lectureIndex)=>{
    if(action === 'add'){
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }else if(action=== 'remove'){
      setChapters(
        chapters.map((chapter)=>{
          if(chapter.chapterId===chapterId){
            chapter.chapterContent.splice(lectureIndex,1);
          }
          return chapter;
        })
      )
    }
  }

  const addLecture=()=>{
    setChapters(
      chapters.map((chapter)=>{
        if(chapter.chapterId === currentChapterId){
          const newLecture={
            ...lectureDetails,
            lectureOrder:chapter.chapterContent.length>0? chapter.chapterContent.slice(-1)[0].lectureOrder+1:1,
            lectureId:uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle:'',
      lectureDuration:'',
      lectureUrl:'',
      isPreviewFree:false,
    });
  }
  const handleSubmit=async (e)=>{
    try{
     e.preventDefault()
     if(!image){
      toast.error('Thumbnail not selected')
     } 
     const courseData={
      courseTitle,
      courseDescription:quillRef.current.root.innerHTML,
      coursePrice:Number(coursePrice),
      discount:Number(discount),
      courseContent:chapters,
     }

     const formData=new FormData()
     formData.append('courseData',JSON.stringify(courseData))
     formData.append('image',image)

     const token=await getToken()
     const {data}=await axios.post(backendUrl + '/api/educator/add-course',formData, {headers:{Authorization:`Bearer ${token}`}})

     if(data.success){
      toast.success(data.message)
      setCourseTitle('')
      setCoursePrice(0)
      setDiscount(0)
      setImage(null)
      setChapters([])
      quillRef.current.root.innerHTML=""
     }else{
toast.error(data.message)
     }
    }catch(error){
      toast.error(error.message)
    }
    
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="w-full flex flex-col p-6 pb-20 overflow-y-auto 
bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-1">
          <p className="font-medium">Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type Here"
            className="outline-none py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium">Course Details</p>
          <div ref={editorRef} className="h-40 border rounded"></div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-medium">Course Price</p>
          <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            className="outline-none py-2 w-28 px-3 rounded border border-gray-500"
            required
          />

          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-medium">Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="p-3 bg-blue-500 rounded cursor-pointer"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />

              {image && (
                <img
                  className="max-h-10 rounded"
                  src={URL.createObjectURL(image)}
                  alt=""
                />
              )}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium">Discount (%)</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            min={0}
            max={100}
            className="outline-none py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="bg-white border rounded-lg mb-4 shadow"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`cursor-pointer transition-transform duration-200 ${
                      chapter.collapsed ? "-rotate-90" : "rotate-0"
                    }`}
                    onClick={() => {
                      const updated = [...chapters];
                      updated[chapterIndex].collapsed =
                        !updated[chapterIndex].collapsed;
                      setChapters(updated);
                    }}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>

                <span>{chapter.chapterContent.length} Lectures</span>
                <img
                  src={assets.cross_icon} onClick={()=>handleChapter('remove',chapter.chapterId)}
                  className="cursor-pointer"
                  alt=""
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} -{" "}
                        {lecture.lectureDuration} mins -{" "}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          className="text-green-500 underline"
                        >
                          Link
                        </a>{" "}
                        - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>

                      <img
                        src={assets.cross_icon} onClick={()=> handleLecture('remove',chapter.chapterId,lectureIndex)}
                        className="cursor-pointer"
                        alt=""
                      />
                    </div>
                  ))}

                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer"
                    onClick={() => handleLecture('add',chapter.chapterId)}
                  >
                    Add Lectures
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="mt-3 flex justify-center items-center bg-blue-100 p-3 rounded-lg cursor-pointer" onClick={()=>handleChapter('add')}>
            Add Chapters
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

              <div className="mb-2">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Lecture Duration (mins)</p>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="scale-125"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
                <p>Free Preview?</p>
              </div>

              <button onClick={addLecture}
                type="button"
                className="w-full bg-green-600 text-white px-4 py-2 rounded"
              >
                ADD
              </button>

              <img
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-4 cursor-pointer"
                onClick={() => setShowPopup(false)}
                alt=""
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-3 px-8 rounded mt-6 self-start"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
