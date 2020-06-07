import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { StatisticsService } from './statistics.service';
import { sub, format, parseISO, isSameDay } from 'date-fns';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent implements OnInit {
  lineChartType = 'line';
  pieChartType = 'pie';

  itemsMonthLoading: boolean;
  itemsMonthData: ChartDataSets[];
  itemsMonthLabels: Label[];
  itemsMonthOptions: ChartOptions;

  itemsCategoriesLoading: boolean;
  itemsCategoriesData: number[];
  itemsCategoriesLabels: Label[];
  itemsCategoriesOptions: ChartOptions;

  constructor(private statsService: StatisticsService) {
    this.itemsMonthLoading = true;
    this.itemsMonthData = [];
    this.itemsMonthLabels = [];
    this.itemsMonthOptions = {
      responsive: true,
      title: { display: true, fontSize: 16, text: 'Tus productos en los últimos 30 días' }
    };

    this.itemsCategoriesLoading = true;
    this.itemsCategoriesData = [];
    this.itemsCategoriesLabels = [];
    this.itemsCategoriesOptions = {
      responsive: true,
      title: { display: true, fontSize: 16, text: 'Categorías de tus productos' }
    };
  }

  ngOnInit(): void {
    this.statsService.getItemsMonthStats().subscribe(res => {
      const views = [];
      const favorites = [];
      const chats = [];

      for (let days = 0; days < 30; days++) {
        const date = sub(new Date(), { days });

        // Add label
        this.itemsMonthLabels.unshift(format(sub(new Date(), { days }), 'dd/MM'));

        // Add views
        const view = this.findStat(res.views, date);
        views.unshift(view ? +view.count : 0);

        // Add favorites
        const favorite = this.findStat(res.favorites, date);
        favorites.unshift(favorite ? +favorite.count : 0);

        // Add chats
        const chat = this.findStat(res.chats, date);
        chats.unshift(chat ? +chat.count : 0);
      }

      this.itemsMonthData.push({ data: views, label: 'Visitas', fill: false });
      this.itemsMonthData.push({ data: favorites, label: 'Favoritos', fill: false });
      this.itemsMonthData.push({ data: chats, label: 'Contactos', fill: false });

      this.itemsMonthLoading = false;
    });

    this.statsService.getItemsCategoriesStats().subscribe(res => {
      res.forEach((cat: { category: Category; items: number }) => {
        this.itemsCategoriesLabels.push(cat.category.name);
        this.itemsCategoriesData.push(+cat.items);
      });

      this.itemsCategoriesLoading = false;
    });
  }

  findStat(
    stats: { [dateISO: string]: string; count: string }[],
    date: Date
  ): { [dateISO: string]: string; count: string } {
    return stats.find(statistic => isSameDay(date, parseISO(statistic.date)));
  }
}
