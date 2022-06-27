import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Title from 'components/title';
import Catalog from 'components/catalog/list';

import {getData} from 'data/catalog';

import styles from 'styles/pages/Index.module.scss'


interface IPageProps {
  data: any[];
}

export async function getStaticProps() {
  const data = await getData();

  console.log(data);

  return {
    props: {
      data: data || []
    }
  };
}

const Index: NextPage<IPageProps> = (props) => {
  console.log(props);
  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzle NFT Market</title>
        <meta name="description" content="Permissionless issue and trade NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Title title="Explore Puzzle Market" />
      <div className={styles.description}>Puzzle Market is place where you can create, buy and sell NFTs</div>

      <Catalog items={props.data} />
    </div>
  )
}

export default Index
