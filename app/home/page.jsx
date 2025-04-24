"use client";
import Loader from "../components/Loader"
import CharacterCard from "../components/CharacterCard";
import { useEffect, useState, useRef } from "react";
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
    const [loading, setLoading] = useState(true);

    const cacheRef = useRef(new Map());

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(`♻️ Removido do cache: ${firstKey}`);
            }
        };

        console.log("\n============== BUSCA INICIADA ==============");
        console.log(`📊 Cache anterior: ${cache.size} páginas`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`✅ Usando cache: ${cacheKey}`);
        } else {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);

                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });

                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`💾 Salvo no cache: ${cacheKey}`);
            } catch (error) {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`📋 Prefetch salvo: ${nextCacheKey}`);
            } catch (err) {
                console.log(`❌ Prefetch falhou: ${nextCacheKey}`, err);
            }
        } else {
            console.log("ℹ️ Prefetch ignorado: já no cache ou fora do limite");
        }

        console.log(`📦 Cache final: ${cache.size} páginas`);
        for (const [key, val] of cache.entries()) {
            console.log(`📦 ${key}: ${val.results.length} personagens`);
        }
        console.log("============== FIM DA BUSCA ==============\n");
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchCharacters(search, page);
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

    const handleCardClick = (char) => {
        toast.info(`Você clicou em ${char.name} que é ${char.gender}`);
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
                <div className={styles.buttons}>
                <button onClick={handleSearch} className={styles.buttonSearch}>
                    Buscar
                </button>
                <button onClick={handleReset} className={styles.buttonReset}>
                    Resetar
                </button>
            </div>
            <span className={styles.pageIndicator}>
                Página {page} de {totalPages}
            </span>
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

            {notFound && <h1 className={styles.notFound}>Nenhum personagem encontrado</h1>}

            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            ) : (
            <div className={styles.grid}>
                {characters.map((char) => (
                    <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char)} />
                ))}
            </div>
            )}
        </div>
    )
}



