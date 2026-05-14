export class KPIDashboard {
    constructor({
                    id = null,
                    name = null,
                    value = null,
                    goal = null,
                    status = null,
                    update_date = null
                }) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.goal = goal;
        this.status = status;
        this.update_date = update_date;
    }
}