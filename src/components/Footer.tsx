import styles from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <footer className={styles.footer}>
        <p>O Sistema de Gestão ideal para o seu negócio.</p>
        <p className={styles.reserved}>Todos os direitos reservados © 2025</p>
        <p>Desenvolvimento por Keysson</p>
      </footer>
    );
};

export default Footer;