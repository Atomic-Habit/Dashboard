import React, { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "../utils/constants";
import { deleteArticle, saveArticle } from '../utils/firebase';
import imageIcone from '../images/image.png'
import arrow from '../images/arrow.png'
import UnsplashReact, { BlobUploader, withDefaultProps } from "unsplash-react"
import resizeFile from '../utils/resizeFile';
import trach from '../images/trach.svg'

const ReactEditorJS = createReactEditorJS();

const EditArticle = (props) => {

    const [title, setTitle] = useState(props.article.title)
    const [description, setDescription] = useState(props.article.description)
    const [imagePrev, setImagePrev] = useState(props.article.image)
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
        <>

            {isUnsplash &&
                <UnsplashReact
                    accessKey={process.env.UNSPLASH_ACCESS_KEY}
                    Uploader={withDefaultProps(BlobUploader, { name: "file" })}
                    onFinishedUploading={handleUnsplashPhoto}
                />
            }


            <div className="imageBox mb-20 pt-5 relative">
                <input type="file" onChange={onImageChange} ref={inputFile} style={{ display: 'none' }} className="filetype border-none " />
                <button className={`absolute w-full h-[400px] ${imagePrev == null && "border"} rounded-[20px]`} onClick={onButtonClick}>
                    <img className={`${imagePrev == null ? "opacity-50" : "opacity-0"} w-[50px] mx-auto`} src={imageIcone} alt="" />
                </button>
                <div className="img-container h-[400px] overflow-hidden flex itmes-center">
                    <div className="image h-full w-full" style={{ backgroundImage: 'url(' + imagePrev + ')' }}></div>
                </div>
            </div>

            <input className='outline-none text-[32px] font-black' maxLength={50} type="text" placeholder='Titre' value={title} onChange={(e) => setTitle(e.target.value)} />
            <br />
            <textarea className='w-full mt-5 outline-none text-[20px] opacity-50' placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)} name="description" id="description" maxLength={150}></textarea>

            <ReactEditorJS
                tools={EDITOR_JS_TOOLS}
                onInitialize={handleInitialize}
                defaultValue={{
                    time: 1635603431943,
                    blocks: props.article.text
                }}
            />
        </>
    )
}

const Article = (props) => {

    const article = props.article

    return (
        <>

            <div className="image h-[400px] max-w-[600px] mb-20 mt-5" style={{ backgroundImage: 'url(' + article?.image + ')' }}></div>
            <h1 className='mt-0'>{article?.title}</h1>
            <p className='opacity-50'>{article?.description}</p>

            {
                article?.text.forEach((data, key) => {
                    if (data.type === "header") {
                        console.log(data.data.level)
                        switch (data.data.level) {
                            case 1:
                                return <h1 key={key}>{data.data.text}</h1>
                            case 2:
                                return <h2 key={key}>{data.data.text}</h2>
                            case 3:
                                return <h3 key={key}>{data.data.text}</h3>
                            default:
                                return
                        }
                    }
                    return <p key={key}>{data.data.text}</p>
                })
            }
        </>
    )
}

const ArticleEditor = (props) => {
    const [isEdit, setIsEdit] = useState(false)
    const params = useParams()
    const article = props.articles.find((article) => { return article.id === params.id })
    const navigation = useNavigate()

    const handleSave = () => {
        setIsEdit(!isEdit)
    }

    const handleDelete = () => {
        deleteArticle(article.id)
            .then(() => navigation('/'))
            .catch((err) => console.log(err))
    }

    return (
        <section id='article' className='py-20 max-w-[600px] mx-auto article !text-[#000]'>

            <div className="flex justify-between items-center">
                <Link to={"/"}><img className='w-[30px]' src={arrow} alt="back arrow" /></Link>
                <div className="flex transition-all duration-300 ease-in-out">
                    <button className='h-[50px] mr-2 px-10 bg-accent text-white rounded-[10px] transition-all duration-300 ease-in-out' onClick={isEdit ? () => handleSave() : () => setIsEdit(!isEdit)}>{isEdit ? 'Sauvgarder' : 'Modifier'}</button>
                    {isEdit && <button className='rounded-[10px] h-[50px] w-[50px] flex items-center justify-center bg-red' onClick={handleDelete}><img className='h-[25px]' src={trach} alt='poubelle' /></button>}
                </div>
            </div>

            { isEdit ? <EditArticle article={article} /> : <Article article={article} /> }

        </section>
    )
}

export default ArticleEditor