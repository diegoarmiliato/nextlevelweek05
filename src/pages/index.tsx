export const Home = (props) => {
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export const getStaticProps = async () => {
  const res = await fetch('http://localhost:3333/episodes');
  const data = await res.json();

  return(
    {
      props: {
        episodes: data,
      },
      revalidate: 60 * 60 * 8
    }
  )
}

export default Home;