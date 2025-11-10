import Image from "next/image";
import VideoComponent from "./components/VideoComponent";
import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <div>
      <VideoComponent/>
      <FileUpload fileType="video"/>
    </div>
  )
}
