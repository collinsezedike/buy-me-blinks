import styles from '@/styles/Intro.module.css'

function Intro(){

  return (
    <section className={styles.intro_container}>
        <h1 className={styles.intro_h1}>
          Web3 creators deserve more than just likes
        </h1>
        <p className={styles.intro_p}>
          We are making it easy for fans to show real appreciation
        </p>
        <button className={styles.intro_btn} >Get Started</button>
    </section>
  )
}

export default Intro
