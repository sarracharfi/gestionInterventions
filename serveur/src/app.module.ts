import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ComptableModule } from './comptable/comptable.module';
import { FactureModule } from './facture/facture.module';
import { ContactModule } from './contact/contact.module';
import { GeolocModule } from './geoloc/geoloc.module';
import { TechnicienModule } from './technicien/technicien.module';
import { MaterielModule } from './materiel/materiel.module';
import { ClientModule } from './client/client.module';
import { DemandeInterventionModule } from './demande-intervention/demande-intervention.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'interventions',
      entities: [User, __dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
      ssl: false,
    }),
    AuthModule,
    UsersModule,
    ComptableModule,
    FactureModule,
    ContactModule,
    GeolocModule,
    TechnicienModule,
    MaterielModule,
    ClientModule,
    DemandeInterventionModule,
    EvaluationModule,
  ],
  controllers: [AppController],  
  providers: [AppService],       
})
export class AppModule {}
