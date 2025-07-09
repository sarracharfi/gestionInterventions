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
      entities: [User, __dirname + '/**/*.entity{.ts,.js}'], // ajoute ici toutes les entités
      synchronize: true,
      ssl: false,
    }),
    AuthModule,
    UsersModule,
    ComptableModule,
    FactureModule,
    ContactModule,
  ],
  controllers: [AppController], // ici seulement le controller de base (AppController)
  providers: [AppService],      // idem, juste les services de base
})
export class AppModule {}
