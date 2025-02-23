import { useAppSelector } from "../../hooks";
import { selectAlerts } from "./alertsSlice";

export function Alerts() {
    const alerts = useAppSelector(selectAlerts);

    return Array(...alerts.values());
}