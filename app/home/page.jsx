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

    const handleFilterClick = () => {
        toast.info(`o filtro foi reiniciado`);
    };

    return (
        <div className={styles.container}>
            <ToastContainer 
            position="top-rigth"
            autoClose={7500}
            theme="light"
            />
            <h1 className={styles.title}>Rick and Morty Characters</h1>
            <div className={styles.controls}>
                <input type="text" placeholder="Buscar por nome" value={search} onChange={(e) => setSearch(e.target.value)} className={styles.input} />
                <button onClick={() => fetchCharacters(search.trim())} className={styles.buttonSearch}>Buscar</button>
                <button onClick={() => { setSearch(""); fetchCharacters(); handleFilterClick()}} className={styles.buttonReset}>Resetar</button>
            {notFound && (
            <h1 className={styles.notFound}>Não foi encontrado nenhum personagem com esse nome</h1>
      )}
            </div>
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