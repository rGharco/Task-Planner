import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import styles from './home.module.css'

export default function HomePage() {
    return (
        <>
            <PageTitle text="Home"/>
            <InterfaceBackground>
                Welcome, UserName!
            </InterfaceBackground>
        </>
    )
}