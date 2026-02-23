import React from 'react'
import NavBar from '../components/NavBar'
import Slider from '../components/Slider'
import Communities from './communities/Communities'
import homeImg from '../assets/images/home.png'
import { useNavigate } from 'react-router-dom'
import blob from '../assets/images/blobC.svg'
import encryption from '../assets/images/encryption.svg'
import ai from '../assets/images/ai.svg'
import human from '../assets/images/human.svg'
import anonymous from '../assets/images/anonymous.svg'
import CrisisSupport from '../components/CrisisSupport'
import { useAuth } from "../util/authContext"

const Home = () =>{
  
  let navigate = useNavigate()
  const sliderRef1 = React.useRef(null)
  const sliderRef2 = React.useRef(null)
  const sliderRef3 = React.useRef(null)
  const sliderRef4 = React.useRef(null)

   const useIsVisible = (ref) => {
    
    const [isIntersecting, setIntersecting] = React.useState(false);
  
    React.useEffect(() => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting)
      });
      
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }, [ref]);
  
    return isIntersecting;
  }

  const isVisible1 = useIsVisible(sliderRef1)
  const isVisible2 = useIsVisible(sliderRef2)
  const isVisible3 = useIsVisible(sliderRef3)
  const isVisible4 = useIsVisible(sliderRef4)

  const {user, loading} = useAuth()

  if (loading) return null;

  return(
    <div id="top" className='scroll-mt-24'>
      <NavBar/>
      <section className='flex items-center justify-center mt-20 md:mt-25 mb-35'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mx-5 place-items-center'>
        <div className='relative flex flex-col mx-auto my-6 px-5 py-5 w-[clamp(20rem,40vw,42rem)] max-md:bg-lime-100 max-md:rounded-xl lg:px-12'>
          <img
            src={blob}
            alt="blob"
            className="hidden xl:block absolute inset-0 -translate-y-[20%] -translate-x-[2%] w-[120%] max-w-none opacity-60 -z-10 pointer-events-none"
          />
          <h2 className='text-4xl font-bold mb-4 text-left'>Hi!</h2>
            <h4 className='mb-4 text-2xl font-semibold text-slate-600'>
              {!user && <button 
                className='cursor-pointer px-4 py-1 mr-2 bg-[var(--color-six)] text-white rounded-lg border border-transparent mb-4
                hover:border-slate-200 hover:bg-[var(--color-eight)]/70 hover:shadow-md hover:text-slate-600 decoration-1 decoration-transparent hover:decoration-current transition-colors duration-200'
                onClick={() => navigate("/login")}
                >
                  Join us
              </button> }
              { user ? "Let's start chatting!" : " and let's start chatting!"} 
            </h4>
            <p className='text-xl'>Peer2Peer is a safe, anonymous and confidential community for users to support each other through mental health and day to day struggles.</p>
          </div>

          <div className='hidden md:flex items-center justify-center pl-6 ml-25'>
            <img src={homeImg} alt="home Image" />
          </div>
        </div>
      </section>

      <Communities/>

      <section id="About Us" className='mt-10 w-screen md:mt-15 lg:mt-0 scroll-mt-30 mb-15 '>
        <h2 className="w-screen bg-[var(--color-six)] text-slate-100 font-semibold px-5 py-10 rounded-sm text-3xl text-center bg-opacity-80 mb-15">About Us</h2>

        <div className='flex flex-col gap-5'>
          <div ref={sliderRef1} className='flex self-start'>
            <Slider pic={anonymous} name="Built for Anonymity" description="There are no profile pictures, usernames are randomly generated, and we don’t ask for personal details. You can share without worrying about being recognized or traced." pos="start" bgColor="dark" isVisible={isVisible1} duration="1200"/>
          </div>
          <div ref={sliderRef2} className='flex self-end'>
            <Slider pic={encryption} name="Encrypted conversations" description="Your posts and private messages are encrypted to protect your privacy. This means what you write stays secure and read only by the people it’s meant for, no outsiders or advertisers." pos="end" bgColor="light" isVisible={isVisible2} duration="4200"/>
          </div>
          <div ref={sliderRef3} className='flex self-start'>
            <Slider pic={human} name="Human-Led Moderation" description="All moderation is handled by real people, not third-party AI systems. Your data isn’t sent off to be analyzed or trained elsewhere, it stays here." pos="start" bgColor="dark" isVisible={isVisible3} duration="7200"/>
          </div>
          <div ref={sliderRef4} className='flex self-end'>
            <Slider pic={encryption} name="Contact Us" description="For any enquires or issues contact us at this email address: p2pTeam@gmail.com" pos="end" bgColor="light" isVisible={isVisible4} duration="10200"/>
          </div>
        </div>
      </section>

      <section className='w-screen md:mt-10 lg:mt-0 scroll-mt-30'>
        <h2 className="w-screen bg-[var(--color-six)] text-slate-100 font-semibold px-5 py-10 text-3xl text-center bg-opacity-80"></h2>
      </section>
  </div>

  )
}

export default Home