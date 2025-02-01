import { mdiAlertCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

export default function UnknownState () {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
        }}>
            <Icon path={mdiAlertCircleOutline} size={2} color={"#aaa"} />
            Can&apos;t display file
        </div>
    )
}