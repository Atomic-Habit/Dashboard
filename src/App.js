import { useEffect, useState } from "react";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Home from "./Pages/Home";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import ArticleMaker from "./Pages/ArticleMaker";
import { auth } from "./utils/firebase";
import Authentification from "./Pages/Authentification";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./utils/firebase";
import Article from "./Pages/Article";

const App = (props) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  const getArticles = async () => {
    return await getDocs(collection(db, "articles"))
  }

  useEffect(() => {

    let isMounted = true; // note mutable flag
    let user = auth.currentUser

    if (user) {

      navigate('/')
      const newArticles = []
      getArticles().then(data => {
        if (isMounted) data.forEach((doc) => {
          const newData = doc.data()
          newData["id"] = doc.id
          newArticles.push(newData)
        });
        setArticles(newArticles)
        setLoadingArticles(false)
      })

    } else {
      navigate('/authentification')
    }

    return () => { isMounted = false }; // cleanup toggles value, if unmounted

  }, [auth.currentUser])
  
  return (
    <div className="App">
      {//location.pathname != "/authentification" && <Navbar />
      }
      <Routes>
        <Route path="/" element={<Home articles={articles} loadingArticles={loadingArticles} />} />
        <Route path="/create" element={<ArticleMaker />} />
        <Route path="/article/:id" element={<Article articles={articles} />} />
        <Route path="/authentification" element={<Authentification />} />
        <Route path="*" element={<NotFound status={404} />} />
      </Routes>
    </div>
  );
}
export default App;
