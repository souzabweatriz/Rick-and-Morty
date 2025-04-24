import Image from "next/image";
import styles from "../../styles/Loader.module.css"
import loading from "../../public/loading.gif"

export default function Loader() {
    return (
        <div className={styles.container}>
            <Image src={loading} alt="Carregando" width={300} height={300} priority className={styles.image} />
            <h1 className={styles.message}>Carregando</h1>
        </div>
    );
}