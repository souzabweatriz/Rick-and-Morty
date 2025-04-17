"use client"
import CharacterCard from "../components/CharacterCard"
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../home/Home.module.css"
import { ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const [notFound, setNotFound] = useState(false)
    const [characters, setCharacters] = useState([]);

    const fetchCharacters = async (name = "") => {
        setNotFound(false);
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`)
            setCharacters(data.results);
        } catch (error) {
            console.error('Erro ao buscar personagens', error);
            setNotFound(true);
            setCharacters([]);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleCardClick = (name) => {
        toast.info(`Você clicou em ${name}`);
    };

    return (
        <div className={styles.container}>
            <ToastContainer 
            position="top-rigth"
            autoClose={7500}
            theme="light"
            />
            <div className={styles.controls}>
                <input type="text" placeholder="Buscar por nome" value={search} onChange={(e) => setSearch(e.target.value)} className={styles.input} />
                <button onClick={() => fetchCharacters(search.trim())} className={styles.buttonSearch}>Buscar</button>
                <button onClick={() => { setSearch(""); fetchCharacters(); }} className={styles.buttonReset}>Resetar</button>
            </div>
            {notFound && (
        <h1 className={styles.notFound}>Nenhum personagem encontrado 😢</h1>
      )}
            <div className={styles.grid}>
                {characters.map((char) => (
                    <CharacterCard 
                    key={char.id} 
                    character={char} 
                    onClick={() => handleCardClick(char.name)}
                    
                    />
                ))}
            </div>
        </div>
    );
}