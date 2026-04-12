import Header from "../components/Header";
import Footer from "../components/Footer";
import LinkModuloForm from "../components/LinkModuloForm";
import styles from "../styles/GestaoAcesso.module.css";

const GestaoAcesso = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content} style={{paddingTop: '100px'}}>
        <LinkModuloForm
          onSuccess={() => {}}
          onError={() => {}}
        />
      </div>
      <Footer />
    </div>
  );
};

export default GestaoAcesso;
