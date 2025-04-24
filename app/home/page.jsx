"use client";
import CharacterCard from "../components/CharacterCard";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../home/Home.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setNotFound(false);
        try {
            const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}&page=${pageNumber}`);
            setCharacters(data.results);
            setTotalPages(data.info.pages);
        } catch (error) {
            console.error("Erro ao buscar personagens:", error);
            setNotFound(true);
            setCharacters([]);
        }
    };

    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchCharacters(search.trim(), 1);
    }, [search]);

    const handleSearch = () => {
        setPage(1);
        fetchCharacters(search.trim(), 1);
    };

    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("Filtro foi resetado", { position: "top-left" });
    };

    const handleCardClick = (name) => {
        toast.info(`Você clicou em ${name}`);
    };

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={2000} theme="light" />

            <h1 className={styles.title}>Rick and Morty Characters</h1>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.input}
                />

                <button onClick={handleSearch} className={styles.buttonSearch}>
                    Buscar
                </button>

                <button onClick={handleReset} className={styles.buttonReset}>
                    Resetar
                </button>

                {notFound && (
                    <h1 className={styles.notFound}>Não foi encontrado nenhum personagem com esse nome</h1>
                )}
            </div>

            <div className={styles.navControls}>
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={styles.buttonNav}
                >
                    Página Anterior
                </button>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={styles.buttonNav}
                >
                    Próxima Página
                </button>
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
