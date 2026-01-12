


export default function Logo(props?: {width?: string}) {
    return(
        <>
            <a href="/">
                <img src="/logo.png" alt="logo" height={'auto'} width={props?.width ? props.width : '80px'} style={
                    {
                        transition: '0.2s'
                    }
                }/>
            </a>
        </>
    )
}