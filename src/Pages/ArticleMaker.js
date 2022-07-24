import React, { useState, useRef } from 'react'
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../utils/constants";
import { saveArticle } from '../utils/firebase';
import imageIcone from '../images/image.png'
import arrow from '../images/arrow.png'
import { Link } from 'react-router-dom';
import UnsplashReact, { BlobUploader, withDefaultProps } from "unsplash-react"
import resizeFile from '../utils/resizeFile';

const ReactEditorJS = createReactEditorJS();

const ArticleMaker = () => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imagePrev, setImagePrev] = useState(null)
    const [image, setImage] = useState(null)
    const [isUnsplash, setIsUnsplash] = useState(false)

    const inputFile = useRef(null)

    // Init Editor.js
    const editorCore = React.useRef(null)
    const handleInitialize = React.useCallback((instance) => {
        editorCore.current = instance
    }, [])

    // Récupération du text Editor.js ( async func ) \\
    const getEdidorData = React.useCallback(async () => {
        return editorCore.current.dangerouslyLowLevelInstance?.save();
    }, [])

    // On sauvgarde l'article après avoir récupèrer le text \\
    const handleSave = () => {
        getEdidorData()
            .then((data) => {
                saveArticle(title, image, data, description)
            })
    }

    // Simulation du click le file input \\
    const onButtonClick = () => {
        inputFile.current.click();
    };

    // IMAGE \\
    const onImageChange = async (event) => {
        // On compress l'image à 70%
        try {
            const file = event.target.files[0];
            const res = await resizeFile(file);
            setImage(res); // On sauvgarde l'image compressée
            setImagePrev(URL.createObjectURL(res)); // On créer un lien pour la preview de l'image
          } catch (err) {
            console.log(err);
          }
    };

    const handleUnsplashPhoto = async (resImage) => {
        // On compress l'image à 70%
        try {
            const file = resImage;
            const res = await resizeFile(file);
            setImage(res); // On sauvgarde l'image compressée
            console.log(res);
            setImagePrev(URL.createObjectURL(res)); // On créer un lien pour la preview de l'image
          } catch (err) {
            console.log(err);
          }
    }

    return (
        <section id='article' className='max-w-[600px] mx-auto py-20 px-10'>

            <button className='py-2 px-10 bg-green text-white rounded-[10px] fixed bottom-10 right-10 z-10' onClick={handleSave}>Sauvgarder</button>

            <div className="flex justify-between items-center">
                <Link to={"/"}><img className='w-[30px]' src={arrow} alt="back arrow" /></Link>
                <button className='py-2 px-10 bg-accent text-white rounded-[10px] transition-all duration-300 ease-in-out' onClick={() => setIsUnsplash(!isUnsplash)}>{isUnsplash ? 'Fermer' : 'Unsplash'}</button>
            </div>

            { isUnsplash &&
                <UnsplashReact
                accessKey={process.env.UNSPLASH_ACCESS_KEY}
                Uploader={withDefaultProps(BlobUploader, { name: "file" })}
                onFinishedUploading={handleUnsplashPhoto}
                />
            }


            <div className="imageBox pb-10 pt-5 relative">
                <input type="file" onChange={onImageChange} ref={inputFile} style={{ display: 'none' }} className="filetype border-none " />
                <button className={`absolute w-full h-[300px] ${imagePrev == null && "border"} rounded-[20px]`} onClick={onButtonClick}>
                    <img className={`${imagePrev == null ? "opacity-50" : "opacity-0"} w-[50px] mx-auto`} src={imageIcone} alt="" />
                </button>
                <div className="img-container h-[300px] overflow-hidden flex itmes-center">
                    <div className="image h-[300px] w-full" style={{ backgroundImage: 'url(' + imagePrev + ')'}}></div>
                </div>
            </div>

            <input className='outline-none text-[40px] font-bold' maxLength={50} type="text" placeholder='Titre' value={title} onChange={(e) => setTitle(e.target.value)} />
            <br />
            <textarea className='w-full mt-5 outline-none' placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)} name="description" id="description" maxLength={150}></textarea>


            <ReactEditorJS
                tools={EDITOR_JS_TOOLS}
                onInitialize={handleInitialize}
                defaultValue={{
                    time: 1635603431943,
                    blocks: [
                        {
                            id: "sheNwCUP5A",
                            type: "header",
                            data: {
                                text: "Votre article...",
                                level: 2
                            }
                        }
                    ]
                }}
            />
        </section>
    )
}

export default ArticleMaker