import { Calendar, CalendarProps, theme, Image } from "antd"
import axios from "axios";
import { type Dayjs } from "dayjs";
import { useState } from "react";
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

export const PhotoList = () => {
    const { token } = theme.useToken();



    const [state, setState] = useState<any[]>([]);

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const onChange = (value: Dayjs) => {

        const timestamp = value.set("h", 0)
            .set("m", 0)
            .set("s", 0)
            .set("ms", 0).valueOf();



        axios.get("http://localhost:8080/photo/findOneDay?timestamp=" + timestamp).then(res => {
            if (res.data.success) {
                setState(res.data.data);
            }
        })
    }

    return <div style={wrapperStyle}>
        <Calendar fullscreen={false} onChange={onChange} onPanelChange={onPanelChange} />
        <Image.PreviewGroup>
            {state.map(s => s.type === "Image" ?
                <Image
                    key={s.id}
                    width={200}
                    src={`http://localhost:9090/${s.src}`}
                /> :
                <Plyr key={s.id} width={200} source={
                    {
                        type: 'video',
                        title: 'Example title',
                        sources: [
                            {
                                src: `http://localhost:9090/${s.src}`,
                                type: 'video/mp4',
                                
                            },
                        ]
                    }
                } />
            )}
        </Image.PreviewGroup>
    </div>
}