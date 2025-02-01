import { mdiAlertCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";

export default function EmptyState () {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
        }}>
            <Icon path={mdiAlertCircleOutline} size={2} color={"#aaa"} />
            Choose a file from the selector above
        </div>
    )
}