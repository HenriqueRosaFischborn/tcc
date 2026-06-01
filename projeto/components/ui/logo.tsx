


export default function Logo(props?: {width?: string}) {
    return(
        <>
            <a href="/">
                <img src="/logo.png" alt="logo" height={'auto'} width={props?.width ? props.width : '60px'} style={
                    {
                        transition: '0.2s'
                    }
                } fetchPriority='low' loading='lazy' decoding='async'/>
            </a>
        </>
    )
}